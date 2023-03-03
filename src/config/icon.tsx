import React, { useEffect, useState } from 'react';
import { createFromIconfontCN } from '@ant-design/icons';
import { Row, Col } from 'antd';
import { useAppDispatch } from '@/store/hooks';
import { setIconList } from '@/store/common/commonSlice';

//所有图标查看预览地址
//https://www.iconfont.cn/collections/detail?spm=a313x.7781069.1998910419.d9df05512&cid=9402
export const IconFont = createFromIconfontCN({
    scriptUrl: '//at.alicdn.com/t/c/font_3749906_xtts0l88tjr.js',
});

export const useIconName = () => {
    const dispatch = useAppDispatch();

    useEffect(() => {
        window.onload = () => {
            if (window._iconfont_svg_string_3749906) {
                const list =
                    window._iconfont_svg_string_3749906
                        ?.match(/(id=")[A-Za-z0-9_-]+"/g)
                        ?.map((item: string, index: number) => {
                            let key = item.split('id="')[1].split('"')[0];
                            return key;
                        }) ?? [];
                dispatch(setIconList(list));
            }
        };
    }, [dispatch]);
};
