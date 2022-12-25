import React from "react";
import { Avatar as AvatarAntd } from 'antd';

import PropTypes from 'prop-types';
import { Avatar } from "./Avatar";
import { COLORS } from "../const/COLORS";

export const AvatarGroup = ({avatars, maxCount, size}) => {
  return (
    <AvatarAntd.Group maxCount={maxCount} size={parseInt(size)} maxStyle={{ color: COLORS.black.regular, backgroundColor: COLORS.grey.lightest }}>
      {avatars.map(avatar => (
        <Avatar {...avatar} size={size}/>
      ))}
    </AvatarAntd.Group>
  );
}

const avatarTypes = {
  presence: PropTypes.oneOf(['online', 'busy', 'offline']),
  name: PropTypes.string,
  size: PropTypes.oneOf([32, 24, 16]),
  src: PropTypes.string,
  onClick: PropTypes.func
};

AvatarGroup.propTypes = {
  avatars: PropTypes.arrayOf(
    PropTypes.objectOf(avatarTypes)
  ),
  maxCount: PropTypes.number,
  size: PropTypes.oneOf([32, 24, 16]),
};

AvatarGroup.defaultProps = {
  avatars: [{
    name: 'Veronika',
    src: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8cHJvZmlsZXxlbnwwfHwwfHw%3D&w=1000&q=80',
    presence: null,
    size: 32
  },{ 
    name: 'Veronika',
    src: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8cHJvZmlsZXxlbnwwfHwwfHw%3D&w=1000&q=80',
    presence: null,
    size: 32
  },{ 
    name: 'Veronika',
    src: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8cHJvZmlsZXxlbnwwfHwwfHw%3D&w=1000&q=80',
    presence: null,
    size: 32
  },{ 
    name: 'Veronika',
    src: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8cHJvZmlsZXxlbnwwfHwwfHw%3D&w=1000&q=80',
    presence: null,
    size: 32
  },{ 
    name: 'Veronika',
    src: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8cHJvZmlsZXxlbnwwfHwwfHw%3D&w=1000&q=80',
    presence: null,
    size: 32
  }]
}
