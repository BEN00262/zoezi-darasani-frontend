/*
    Referred from https://github.com/ivmarcos/react-to-pdf
*/

import React, { createRef } from 'react';
import JsPdf from 'jspdf';
import html2canvas from 'html2canvas';

export interface IReactToPdf {
    targetRef: React.RefObject<unknown>
    filename: string
    options?: any
    x: number
    y: number
    scale: number
    onComplete?: any
    children: any
}

const ReactToPdf: React.FC<IReactToPdf> = ({ children, targetRef, scale, filename, x, y, options, onComplete }) => {
    const _targetRef = createRef();

    const toPdf = () => {
        const source = targetRef || _targetRef
        const targetComponent = (source.current || source) as HTMLElement;

        if (!targetComponent) {
            // this is 
            throw new Error(
                'Target ref must be used or informed.'
            );
        }

        html2canvas(targetComponent, {
            logging: false,
            useCORS: true,
        }).then((canvas: any) => {
            const imgData = canvas.toDataURL();
            const pdf = new JsPdf(options);

            const imgProps= pdf.getImageProperties(imgData);

            // trying to maintain the aspect ratios
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;


            pdf.addImage(imgData, 'PNG', x, y, pdfWidth, pdfHeight);
            pdf.save(filename);

            if (onComplete) onComplete();
        });
    }

    return children({ toPdf, targetRef });
}

export default ReactToPdf;