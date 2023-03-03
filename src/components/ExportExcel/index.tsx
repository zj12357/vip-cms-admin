import React, { useState } from 'react';
import { Button } from 'antd';
interface Props {
    params: any;
    fileName?: string;
    api: (params: any) => any;
}

const ExportExcel = (props: Props) => {
    const { params = {}, api, fileName } = props;
    const [loading, setLoading] = useState(false);
    return (
        <Button
            type={'primary'}
            onClick={async () => {
                setLoading(true);
                delete params.size;
                delete params.page;
                const res = await api(params);
                const aLink = document.createElement('a');
                const blob = new Blob([res], {
                    type: 'application/vnd.ms-excel',
                });
                // 创建一个当前文件的内存URL
                const _href = URL.createObjectURL(blob);
                aLink.style.display = 'none';
                aLink.href = _href;
                document.body.appendChild(aLink);
                aLink.setAttribute('download', `${fileName || '表格'}.xlsx`);
                aLink.click();
                document.body.removeChild(aLink);
                // 手动释放创建的URL对象所占内存
                URL.revokeObjectURL(_href);
                setLoading(false);
            }}
            loading={loading}
        >
            导出
        </Button>
    );
};

export default ExportExcel;
