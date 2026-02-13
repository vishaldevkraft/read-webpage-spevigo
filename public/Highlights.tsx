import { LucideProps } from "lucide-react";

export function Highlights(props: LucideProps) {
    // Check if className contains 'bg-white' to determine fill color
    const isWhite = props.className?.includes('bg-stone-100');
    const fillColor = isWhite ? '#F5F5F4' : '#00E47C';

    return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
            <rect width="24" height="24" rx="4" fill={fillColor} />
            <path d="M6 10V14" stroke="#08312A" stroke-width="1.2" stroke-linecap="round" />
            <path d="M9 8V16" stroke="#08312A" stroke-width="1.2" stroke-linecap="round" />
            <path d="M12 4V20" stroke="#08312A" stroke-width="1.2" stroke-linecap="round" />
            <path d="M15 9V15" stroke="#08312A" stroke-width="1.2" stroke-linecap="round" />
            <path d="M18 11V13" stroke="#08312A" stroke-width="1.2" stroke-linecap="round" />
            <path d="M19.8124 2.5069C19.8769 2.33278 20.1231 2.33278 20.1876 2.5069L20.7784 4.10348C20.7986 4.15822 20.8418 4.20139 20.8965 4.22164L22.4931 4.81243C22.6672 4.87686 22.6672 5.12314 22.4931 5.18757L20.8965 5.77836C20.8418 5.79861 20.7986 5.84178 20.7784 5.89652L20.1876 7.4931C20.1231 7.66722 19.8769 7.66722 19.8124 7.4931L19.2216 5.89652C19.2014 5.84178 19.1582 5.79861 19.1035 5.77836L17.5069 5.18757C17.3328 5.12314 17.3328 4.87686 17.5069 4.81243L19.1035 4.22164C19.1582 4.20139 19.2014 4.15822 19.2216 4.10348L19.8124 2.5069Z" fill="#08312A" />
        </svg>
    );
}
