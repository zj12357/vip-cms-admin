import ReactToPrint from 'react-to-print';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import templates from './templates';
import {
    TemplateType,
    TemplateTypeWithFieldProps,
} from '@/hooks/usePrint/print';

export const usePrint = function <T = TemplateTypeWithFieldProps[TemplateType]>(
    type?: TemplateType,
) {
    const printRef = React.useRef<any>();
    const componentRef = React.useRef<HTMLDivElement | null>(null);
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [data, setData] = useState<T>();
    const [name, setName] = useState<TemplateType | undefined>(type);
    const [opts, setOpts] = useState<any>(null);

    const handlePrint = useCallback(
        (data: T, template = name, optss?: any) => {
            if (!template) {
                throw new Error('请设置打印模版');
            }
            setOpts(optss);
            setName(template);
            setData(data);
            setIsOpen(true);
        },
        [name],
    );

    useEffect(() => {
        if (isOpen && data) {
            printRef?.current?.handlePrint();
        }
    }, [data, isOpen]);

    const Template = useMemo(() => {
        return (
            templates.find((t) => t.key === name)?.component ?? React.Fragment
        );
    }, [name]);

    const RegisterPrint = useMemo(() => {
        const Print: React.FC = () => (
            <>
                <ReactToPrint
                    content={() => componentRef.current}
                    ref={printRef}
                    onAfterPrint={() => {
                        setIsOpen(false);
                        opts?.onAfterPrint && opts.onAfterPrint();
                    }}
                />
                {isOpen && (
                    <div style={{ display: 'none' }}>
                        <Template ref={componentRef} data={data as any} />
                    </div>
                )}
            </>
        );
        return Print;
    }, [Template, data, isOpen, opts]);

    return { RegisterPrint, handlePrint, isOpen };
};

export default usePrint;
