# Homepage

## Overview

The Homepage is a visually engaging landing page designed to introduce users to the NUI Network Scanner web application. It utilizes dynamic effects powered by Framer Motion to create an interactive experience as users scroll through the page.

## Functionality

### Google Gemini Effect

The centerpiece of the homepage is the Google Gemini Effect, which dynamically animates SVG paths as the user scrolls down the page. This effect is achieved using Framer Motion's `useScroll` and `useTransform` hooks to manipulate the path lengths based on scroll position.
This components is from ![Aceternity UI](https://ui.aceternity.com/components/google-gemini-effect)


### Get Started Button

The "Get Started" button prompts users to begin exploring the NUI Network Scanner application. It is positioned below the description and triggers a smooth scroll effect to navigate to the dashboard page.

### Smooth Scroll and Fade-Out Effect

The smooth scroll and fade-out effect is applied when the user clicks on the "Get Started" button. This effect is implemented using a custom `Linkbtn` component, which scrolls smoothly to the top of the page, then to the bottom, before fading out the content and redirecting to the dashboard page.
