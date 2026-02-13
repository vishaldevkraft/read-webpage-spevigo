import { LucideProps } from "lucide-react";

export function PlayerPlay(props: LucideProps) {

    return (
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
            <rect width="32" height="32" rx="16" fill="white" />
            <g clip-path="url(#clip0_763_2603)">
                <path d="M21.1042 14.4502L13.7577 10L12.9688 10.7218L12.9713 21.2632L13.7823 22L21.0913 17.6722C21.6648 17.3986 22.0248 16.7914 22.0308 16.0864C22.0363 15.3718 21.6818 14.746 21.1042 14.4502ZM20.8888 17.1256L13.4718 21.5056L13.4698 10.4956L20.8868 14.9884L20.9023 14.9974C21.2968 15.2242 21.5352 15.6094 21.5312 16.0798C21.5278 16.5436 21.2673 16.9246 20.8888 17.125V17.1256Z" fill="#08312A" />
            </g>
            <defs>
                <clipPath id="clip0_763_2603">
                    <rect width="10" height="12" fill="white" transform="translate(12.5 10)" />
                </clipPath>
            </defs>
        </svg>

    );
}
