import type { SVGAttributes } from 'react';

export default function AppLogoIcon(props: SVGAttributes<SVGElement>) {
    return (
        <svg {...props} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M3 6.5H8.2L9.4 4.2C9.6 3.8 10 3.5 10.5 3.5H13.5C14 3.5 14.4 3.8 14.6 4.2L15.8 6.5H21C22.1 6.5 23 7.4 23 8.5V19.5C23 20.6 22.1 21.5 21 21.5H3C1.9 21.5 1 20.6 1 19.5V8.5C1 7.4 1.9 6.5 3 6.5ZM7.4 14A4.6 4.6 0 1 0 16.6 14A4.6 4.6 0 1 0 7.4 14ZM9.9 14A2.1 2.1 0 1 1 14.1 14A2.1 2.1 0 1 1 9.9 14ZM18.4 10A0.9 0.9 0 1 0 20.2 10A0.9 0.9 0 1 0 18.4 10Z"
            />
        </svg>
    );
}
