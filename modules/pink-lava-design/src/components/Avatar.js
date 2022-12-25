import { Avatar as AvatarAntd } from 'antd';
import React from "react";
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { COLORS } from '../const/COLORS';
import { Tooltip } from './Tooltip';

const getInitials = (glue) => {
  if (typeof glue == "undefined") {
    glue = true;
  }
  const initials = glue.replace(/[^a-zA-Z- ]/g, "").match(/\b\w/g)
  if (glue) {
    return initials.join('').toUpperCase();
  }
  return  initials;
};

const capitalize = s => s && s[0].toUpperCase() + s.slice(1)

const PRESENCE = {
  online: {
    "--background": `${COLORS.green.dark}`,
  },
  busy: {
    "--background": `${COLORS.red.regular}`,
  },
  offline: {
    "--background": `${COLORS.grey.light}`,
  },
};

const SIZE = {
  32: {
    "--bottom": `0px`,
    "--right": `0px`,
    "--size": `10px`
  },
  24: {
    "--bottom": `0px`,
    "--right": `0px`,
    "--size": `8px`
  },
  16: {
    "--bottom": `-5px`,
    "--right": `-2px`,
    "--size": `8px`
  },
};


export const Avatar = ({ name, size, src, presence }) => {
  if(presence){
    const backgroundStyles = PRESENCE[presence];
    const sizeStyles = SIZE[size];
    return (
      <div style={{position: 'relative', width: `${size}px`, height: `${size}px`}} >
        <Badge style={{ ...backgroundStyles, ...sizeStyles }}/>
        <Tooltip placement="right" title={`${name} (${capitalize(presence)})`}>
          <AvatarAntd size={parseInt(size)} src={src}>
            {getInitials(name)}
          </AvatarAntd>
        </Tooltip>
      </div>
    )
  }
  return (
    <Tooltip placement="right" title={name}>
      <AvatarAntd size={parseInt(size)} src={src}>{getInitials(name)}</AvatarAntd>
    </Tooltip>
  )
};


const Badge = styled.div`
  width: var(--size);
  height: var(--size);
  border: 1px solid ${COLORS.white};
  background: var(--background);
  border-radius: 96px;
  position: absolute;
  right: var(--right);
  bottom: var(--bottom);
  z-index: 2;
`

Avatar.propTypes = {
  presence: PropTypes.oneOf(['online', 'busy', 'offline']),
  name: PropTypes.string,
  size: PropTypes.oneOf([32, 24, 16]),
  src: PropTypes.string,
  onClick: PropTypes.func
};

Avatar.defaultProps = {
  name: 'Veronika hernandes',
  src: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8cHJvZmlsZXxlbnwwfHwwfHw%3D&w=1000&q=80',
  presence: null,
  onClick: () => console.log("clicked"),
  size: 32
}
