// ==UserScript==
// @name        Twitch Pronouns Custom Tooltip (Alejo.io)
// @namespace   https://github.com/Sydnec/enhance-twitch_pronouns/
// @version     1.0
// @description Affiche les pronoms Twitch Alejo.io avec un tooltip personnalisé
// @author      Sydnec
// @match       https://www.twitch.tv/*
// @grant       none
// ==/UserScript==
(function() {
    'use strict';

    // Create a single tooltip element to reuse.
    const tooltip = document.createElement('div');
    tooltip.style.position = 'absolute';
    tooltip.style.background = 'rgba(0, 0, 0, 0.8)';
    tooltip.style.color = '#fff';
    tooltip.style.padding = '5px 10px';
    tooltip.style.borderRadius = '4px';
    tooltip.style.zIndex = '10000';
    tooltip.style.pointerEvents = 'none'; // Don't block mouse events.
    tooltip.style.display = 'none'; // Hide by default.
    tooltip.style.border = '1px solid white'; // Add a 1px solid white border.
    document.body.appendChild(tooltip);

    function transformPronouns(node) {
        // Find all pronoun elements.
        const pronounElements = node.querySelectorAll('.chat-badge.user-pronoun');

        pronounElements.forEach(pronounElement => {
            // Find the parent element that contains the username.
            const usernameContainer = pronounElement.closest('.chat-line__username-container--hoverable');

            if (usernameContainer && pronounElement.textContent) {
                // Get the text content of the pronoun element.
                const pronounText = pronounElement.textContent.trim();

                // Hide the original pronoun element.
                pronounElement.style.display = 'none';

                // Add event listeners to the username container.
                usernameContainer.addEventListener('mouseenter', (event) => {
                    tooltip.textContent = pronounText;
                    tooltip.style.display = 'block';
                    updateTooltipPosition(event.clientX, event.clientY);
                });

                usernameContainer.addEventListener('mouseleave', () => {
                    tooltip.style.display = 'none';
                });

                // Optional: Update position on mousemove for a "follow" effect.
                usernameContainer.addEventListener('mousemove', (event) => {
                    updateTooltipPosition(event.clientX, event.clientY);
                });
            }
        });
    }

    // Function to update the tooltip's position relative to the cursor.
    function updateTooltipPosition(x, y) {
        // Move it up by adjusting the Y offset (e.g., from +15 to +5).
        tooltip.style.left = `${x}px`;
        tooltip.style.top = `${y-20}px`; // Adjusted from +15 to +5
    }

    // Observer for dynamic changes in the DOM (chat, profiles, etc.).
    const observer = new MutationObserver((mutations) => {
        mutations.forEach(mutation => {
            mutation.addedNodes.forEach(node => {
                if (node.nodeType === 1) {
                    transformPronouns(node);
                }
            });
        });
    });

    observer.observe(document.body, { childList: true, subtree: true });

    // First pass on the initial page load.
    transformPronouns(document.body);
})();
