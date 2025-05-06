import React from 'react';

interface Props {
    className?: string;
    classNameHighlighted: string;
    text: string;
    start?: number;
    length?: number;
    hasComa?: boolean;
}

export default function HighlightedText({
    className,
    classNameHighlighted,
    text,
    start,
    length,
    hasComa,
}: Props) {
    const comma = hasComa ? <>,&nbsp;</> : null;

    if (length! > 0 && start! >= 0 && start! < text.length) {
        const begin = text.substr(0, start);
        const highlighted = text.substr(start!, length);
        const end = text.substr(start! + length!);

        return (
            <React.Fragment>
                {begin && <span className={className}>{begin}</span>}
                <span className={classNameHighlighted}>{highlighted}</span>
                {end && <span className={className}>{end}</span>}
                {comma}
            </React.Fragment>
        );
    }

    return (
        <span className={className}>
            {text}
            {comma}
        </span>
    );
}

export interface MultiHighlightedTextProps extends Omit<Props, 'start'> {
    starts: Array<number>;
}

export function MultiHighlightedText({
    className,
    classNameHighlighted,
    text,
    starts,
    length,
    hasComa,
}: MultiHighlightedTextProps) {
    if (!length || !starts.length) {
        const comma = hasComa ? <>,&nbsp;</> : null;
        return (
            <span className={className}>
                {text}
                {comma}
            </span>
        );
    }

    const substrs = [];
    for (let i = 0, pos = 0; i < starts.length && pos < text.length; ++i) {
        const isLast = i === starts.length - 1;
        const to = starts[i] + (isLast ? text.length : length);
        const substr = text.substring(pos, to);
        if (substr) {
            substrs.push(
                <HighlightedText
                    key={i}
                    className={className}
                    classNameHighlighted={classNameHighlighted}
                    text={substr}
                    start={starts[i] - pos}
                    length={length}
                    hasComa={isLast && hasComa}
                />,
            );
        }
        pos = to;
    }
    return <>{substrs}</>;
}
