import React, { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import { Slider, Modal as ModalAntd } from 'antd';
import styled from 'styled-components';
import PropTypes from 'prop-types';

const createImage = (url) =>
    new Promise((resolve, reject) => {
        const image = new Image();
        image.addEventListener('load', () => resolve(image));
        image.addEventListener('error', (error) => reject(error));
        image.setAttribute('crossOrigin', 'anonymous'); // needed to avoid cross-origin issues on CodeSandbox
        image.src = url;
    });

function getRadianAngle(degreeValue) {
    return (degreeValue * Math.PI) / 180;
}

function rotateSize(width, height, rotation) {
    const rotRad = getRadianAngle(rotation);

    return {
        width: Math.abs(Math.cos(rotRad) * width) + Math.abs(Math.sin(rotRad) * height),
        height: Math.abs(Math.sin(rotRad) * width) + Math.abs(Math.cos(rotRad) * height),
    };
}

async function getCroppedImg(
    imageSrc,
    pixelCrop,
    rotation = 0,
    flip = { horizontal: false, vertical: false }
) {
    const image = await createImage(imageSrc);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx) {
        return null;
    }

    const rotRad = getRadianAngle(rotation);

    // calculate bounding box of the rotated image
    const { width: bBoxWidth, height: bBoxHeight } = rotateSize(
        image.width,
        image.height,
        rotation
    );

    // set canvas size to match the bounding box
    canvas.width = bBoxWidth;
    canvas.height = bBoxHeight;

    // translate canvas context to a central location to allow rotating and flipping around the center
    ctx.translate(bBoxWidth / 2, bBoxHeight / 2);
    ctx.rotate(rotRad);
    ctx.scale(flip.horizontal ? -1 : 1, flip.vertical ? -1 : 1);
    ctx.translate(-image.width / 2, -image.height / 2);

    // draw rotated image
    ctx.drawImage(image, 0, 0);

    // croppedAreaPixels values are bounding box relative
    // extract the cropped image using these values
    const data = ctx.getImageData(pixelCrop.x, pixelCrop.y, pixelCrop.width, pixelCrop.height);

    // set canvas width to final desired crop size - this will clear existing context
    canvas.width = pixelCrop.width;
    canvas.height = pixelCrop.height;

    // paste generated rotate image at the top left corner
    ctx.putImageData(data, 0, 0);

    // As Base64 string
    // return canvas.toDataURL('image/jpeg');

    // As a blob
    return new Promise((resolve, reject) => {
        canvas.toBlob((file) => {
            resolve(URL.createObjectURL(file));
        }, 'image/jpeg');
    });
}

const EditCroppedImage = ({
    image,
    setFile,
    setFileUrl,
    setOpenCrop,
    resetImg,
    resetFile,
    openCrop,
}) => {
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [rotation, setRotation] = useState(0);
    const [zoom, setZoom] = useState(0);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

    const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
        setCroppedAreaPixels(croppedAreaPixels);
    }, []);

    const showCroppedImage = useCallback(async () => {
        try {
            const croppedImage = await getCroppedImg(image, croppedAreaPixels, rotation);
            setFileUrl(croppedImage);
            setOpenCrop(false);
        } catch (e) {
            console.error(e);
        }
    }, [croppedAreaPixels, rotation]);

    const onResetImg = useCallback(() => {
        // if (resetImg) {
        //     setFileUrl(URL.createObjectURL(resetImg));
        // } else {
        //     setFileUrl(image);
        // }
        // setFile(resetFile);
        setOpenCrop(false);
    }, []);

    const onChangeZoom = (newValue) => {
        setZoom(newValue);
    };
    const onChangeRotation = (newValue) => {
        setRotation(newValue);
    };
    return (
        <ModalAntd
            title='Edit Image'
            visible={openCrop}
            onOk={showCroppedImage}
            onCancel={onResetImg}
            okText={'Save'}
            cancelText={'reset'}>
            <CropperContainer>
                <Cropper
                    image={image}
                    crop={crop}
                    rotation={rotation}
                    zoom={zoom}
                    aspect={3 / 3}
                    cropShape={'round'}
                    onCropChange={setCrop}
                    onRotationChange={setRotation}
                    onCropComplete={onCropComplete}
                    onZoomChange={setZoom}
                />
            </CropperContainer>
            <ButtonContainer style={{ marginTop: '1rem' }}>
                <ButtonZoom onClick={() => setZoom(zoom - 0.1)} disabled={zoom - 0.1 < 0}>
                    －
                </ButtonZoom>
                <SliderContainer>
                    <Slider
                        value={zoom}
                        min={0}
                        max={3}
                        step={0.1}
                        aria-labelledby='Zoom'
                        onChange={onChangeZoom}
                    />
                </SliderContainer>
                <ButtonZoom onClick={() => setZoom(zoom + 0.1)} disabled={zoom + 0.1 > 3}>
                    ＋
                </ButtonZoom>
            </ButtonContainer>
            <ButtonContainer>
                <ButtonRotate
                    onClick={() => setRotation(rotation - 1)}
                    disabled={rotation === 0}>
                    ↺
                </ButtonRotate>
                <SliderContainer>
                    <Slider
                        value={rotation}
                        min={0}
                        max={360}
                        step={1}
                        aria-labelledby='Rotation'
                        onChange={onChangeRotation}
                    />
                </SliderContainer>
                <ButtonRotate
                    onClick={() => setRotation(rotation + 1)}
                    disabled={rotation === 360}>
                    ↻
                </ButtonRotate>
            </ButtonContainer>
        </ModalAntd>
    );
};

const CropperContainer = styled.div`
    position: relative;
    width: 100%;
    height: 260px;
`;

const ButtonContainer = styled.div`
    width: 60%;
    align-items: center;
    margin: 0 auto;
    margin-top: 1rem;
    display: flex;
    justify-content: space-between;
`;

const SliderContainer = styled.div`
    width: 80%;
    margin: 0 auto;
`;

const ButtonZoom = styled.button`
    border: none;
    background: #fff;
    font-size: 20px;
    cursor: pointer;
`;

const ButtonRotate = styled.button`
    border: none;
    background: #fff;
    font-size: 16px;
    cursor: pointer;
`;

EditCroppedImage.propTypes = {
    image: PropTypes.string,
    setFile: PropTypes.func,
    setFileUrl: PropTypes.func,
    setOpenCrop: PropTypes.func,
    resetImg: PropTypes.object,
    resetFile: PropTypes.object,
    openCrop: PropTypes.bool,
};

export { EditCroppedImage };
