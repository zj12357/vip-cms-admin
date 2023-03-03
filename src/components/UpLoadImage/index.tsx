import React, { FC, useState, useEffect } from 'react';
import { ProFormUploadButton } from '@ant-design/pro-components';
import { UploadFile, Modal, message } from 'antd';
import type { RcFile, UploadProps } from 'antd/es/upload';
import { getBase64 } from '@/utils/tools';
import { useHttp } from '@/hooks';
import { uploadMemberImage } from '@/api/public';
import { nanoid } from 'nanoid';

type UpLoadImageProps = {
    label: string;
    name: string;
    disabled?: boolean;
    required?: boolean;
    initialValue?: any[];
    max?: number;
};

const UpLoadImage: FC<UpLoadImageProps> = ({
    label,
    name,
    disabled,
    required = false,
    initialValue,
    max,
}) => {
    const [fileList, setFileList] = useState<UploadFile[]>([]);
    const [previewVisible, setPreviewVisible] = useState(false);
    const [previewImage, setPreviewImage] = useState('');

    const { fetchData: _fetchUploadMemberImage } = useHttp<FormData, string>(
        uploadMemberImage,
    );

    const onChange: UploadProps['onChange'] = ({ fileList: newFileList }) => {
        setFileList(
            newFileList.map((item) => {
                return {
                    ...item,
                    photo: item?.response?.url ?? item.url,
                };
            }),
        );
    };
    const handleCancel = () => setPreviewVisible(false);

    const handlePreview = async (file: UploadFile) => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj as RcFile);
        }

        setPreviewImage(file.url || (file.preview as string));
        setPreviewVisible(true);
    };

    const handleUploadMemberImage = async ({
        file,
        onSuccess,
        onError,
    }: any) => {
        const formData = new FormData();
        formData.append('file', file);
        const res = await _fetchUploadMemberImage(formData).catch((error) => {
            onError((err: any) => {
                console.log(err);
            });
            return error;
        });
        if (res.code === 10000) {
            message.success(res.msg);
            //定义返回的结果，给到onChange事件
            const uploadItem = {
                uid: nanoid(),
                name: res.data,
                url: res.data,
                thumbUrl: res.data,
                photo: res.data,
            };
            onSuccess(uploadItem, file);
        }
    };

    useEffect(() => {
        if (initialValue?.length) {
            const newList = initialValue?.map((item: any) => {
                return {
                    uid: nanoid(),
                    name: item.photo,
                    url: item.photo,
                    thumbUrl: item.photo,
                    photo: item.photo,
                };
            });
            setFileList(newList);
        }
    }, [initialValue]);

    return (
        <>
            <ProFormUploadButton
                label={label}
                name={name}
                title="点击或者拖动文件进行上传"
                width={200}
                max={max ?? 4}
                fieldProps={{
                    listType: 'picture-card',
                    fileList: fileList,
                    onPreview: handlePreview,
                    customRequest: handleUploadMemberImage,
                }}
                onChange={onChange}
                rules={[
                    {
                        required: required,
                        message: '请上传图片',
                    },
                ]}
                disabled={disabled}
            />
            <Modal
                visible={previewVisible}
                footer={null}
                onCancel={handleCancel}
                title={label}
            >
                <img alt="图片" style={{ width: '100%' }} src={previewImage} />
            </Modal>
        </>
    );
};

export default UpLoadImage;
