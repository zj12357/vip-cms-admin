import React, { FC } from 'react';
import { Modal, Image } from 'antd';
import { PhotoListItem } from '@/types/api/account';
import './index.scoped.scss';

type PhotoListProps = {
    data?: PhotoListItem[];
};

const PhotoList: FC<PhotoListProps> = ({ data }) => {
    return (
        <Image.PreviewGroup>
            <div className="m-image-list">
                {data?.map((item, index: number) => {
                    return (
                        <div className="m-image-item" key={index}>
                            <Image width={200} src={item?.photo} />
                        </div>
                    );
                })}
                {data?.map((item, index: number) => (
                    <i key={index} className="m-i-item"></i>
                ))}
            </div>
        </Image.PreviewGroup>
    );
};

export default PhotoList;
