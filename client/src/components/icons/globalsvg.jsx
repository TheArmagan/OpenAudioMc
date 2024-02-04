import React from 'react';
import { msg } from '../../client/OpenAudioAppContainer';

export function GlobalSvg() {
  // remix of https://www.svgrepo.com/svg/299039/group-team?edit=true
  // by: SVG Repo
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      data-tooltip-id="global-voice-tooltip"
      data-tooltip-content={msg('vc.tooltip.global')}
      className="inline !mr-1"
      viewBox="0 0 24 24"
      fill="none"
    >
      <path
        d="M11 20.8464C11 21.4378 10.4874 21.9041 9.909 21.781C5.70686 20.8871 2.48103 17.3537 2.04924 12.9986C1.99475 12.449 2.44772 12 3 12H6C6.55228 12 7 12.4477 7 13C7 14.6569 8.34315 16 10 16C10.5523 16 11 16.4477 11 17V20.8464Z"
        fill="#948b7f"
      />
      <path
        d="M17 18.9284C17 19.6986 17.828 20.1634 18.4183 19.6688C19.2094 19.006 19.8964 18.2231 20.4512 17.3481C20.8373 16.7393 20.3607 16 19.6397 16H18C17.4477 16 17 16.4477 17 17V18.9284Z"
        fill="#FEDD58"
      />
      <path
        d="M12 2C14.552 2 16.8807 2.95593 18.6475 4.52924C19.2632 5.07746 18.8233 6 17.9989 6H17.8541C16.2778 6 15 7.27783 15 8.8541C15 9.17761 14.8172 9.47336 14.5279 9.61803L14.4472 9.65836C14.1657 9.79912 13.8343 9.79912 13.5528 9.65836L13.4721 9.61803C13.1828 9.47336 13 9.17761 13 8.8541C13 7.27782 11.7222 6 10.1459 6H10C9.44772 6 9 5.55228 9 5V3.19188C9 2.75503 9.28253 2.36368 9.70784 2.26393C10.4439 2.09131 11.2113 2 12 2Z"
        fill="#948b7f"
      />
      <path
        d="M3.42358 9.99995C2.79136 9.99995 2.31576 9.41831 2.51674 8.81889C3.11731 7.02771 4.21113 5.46278 5.63684 4.28543C6.20619 3.81527 7.00016 4.26156 7.00016 4.99995V4.99995C7.00016 6.6568 8.34331 7.99995 10.0002 7.99995H10.1461C10.6178 7.99995 11.0002 8.38234 11.0002 8.85405C11.0002 9.9351 11.6109 10.9234 12.5779 11.4068L12.6585 11.4472C13.5031 11.8695 14.4972 11.8695 15.3418 11.4472L15.4225 11.4068C16.3894 10.9234 17.0002 9.9351 17.0002 8.85405C17.0002 8.38234 17.3826 7.99995 17.8543 7.99995H20.5137C20.9112 7.99995 21.2753 8.23384 21.4101 8.60776C21.792 9.66694 22.0002 10.8091 22.0002 11.9999C22.0002 12.4037 21.9762 12.8019 21.9297 13.1931C21.8736 13.6654 21.4583 13.9999 20.9827 13.9999H18.0002C16.3433 13.9999 15.0002 15.3431 15.0002 16.9999V20.8081C15.0002 21.2449 14.7176 21.6363 14.2923 21.736C14.2254 21.7517 14.1582 21.7667 14.0907 21.7811C13.5123 21.9041 13.0002 21.4377 13.0002 20.8464V16.9999C13.0002 15.3431 11.657 13.9999 10.0002 13.9999C9.44787 13.9999 9.00016 13.5522 9.00016 12.9999C9.00016 11.3431 7.65701 9.99995 6.00016 9.99995H3.42358Z"
        fill="#FEDD58"
      />
    </svg>
  );
}
