// Linkbtn component for smooth scroll and fade-out effect

// Usage:
// <Linkbtn href="/about">About</Linkbtn>

// This component is used to create a smooth scroll and fade-out effect when clicking on a link.
// It is used in the homepage of the website to navigate to dashboard page.

// We need to use "useState" and "useEffect" hooks from React to manage the state of the fade-out effect.
import { useState, useEffect } from 'react';


// The Linkbtn component takes two props:
// - href: the URL to redirect to when the link is clicked
// - children: the text or component to display as the link
const Linkbtn = ({ href, children }: { href: string; children: React.ReactNode }) => {

    // We use the "useState" hook to manage the state of the fade-out effect.
    const [isFadingOut, setIsFadingOut] = useState(false);

    // We use the "useEffect" hook to add or remove the "fade-out" class from the body element based on the state of the fade-out effect.
    useEffect(() => {
        if (isFadingOut) {
            document.body.classList.add('fade-out');
        } else {
            document.body.classList.remove('fade-out');
        }
    }, [isFadingOut]);

    // The handleClick function is called when the link is clicked.
    const handleClick = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
        e.preventDefault();

        // Scroll to the top smoothly when the link is clicked (before the fade-out effect)
        // It'll trigger the google-gemini-effect
        window.scrollTo({ top: 0, behavior: 'smooth' });

        // Scroll to the bottom smoothly after 1.5 seconds (after the google-gemini-effect completes)
        // It'll trigger the google-gemini-effect again
        setTimeout(() => {
            window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
        }, 1500);

        // Apply fade-out effect after the second scroll completes (after 2 seconds)
        setTimeout(() => {
            setIsFadingOut(true);
        }, 2000);

        // Redirect after the fade-out effect completes (after 3 seconds)
        setTimeout(() => {
            window.location.href = href;
        }, 3000); 
    };

    return (
        <a href={href} onClick={handleClick}>
            {children}
        </a>
    );
};

export default Linkbtn;