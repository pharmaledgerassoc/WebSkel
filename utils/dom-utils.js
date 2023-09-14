export function getClosestParentElement(element, selector, stopSelector) {
    let closestParent = null;
    while (element) {
        if (element.matches(selector)) {
            closestParent = element;
            break;
        } else if (stopSelector && element.matches(stopSelector)) {
            break;
        }
        element = element.parentElement;
    }
    return closestParent;
}
/**
 * Finds the closest DOM element matching a given selector,
 * starting from a provided element and searching through its
 * siblings, parent elements, and their descendants.
 *
 * @param {Element} startElement The DOM element to start the search from.
 * @param {string} targetSelector The CSS selector to match against.
 * @param {string} [stopSelector] An optional CSS selector to specify when to stop traversing.
 * @returns {Element|null} The closest matching DOM element, or null if not found.
 * @throws {TypeError} If invalid arguments are provided.
 */
export function reverseQuerySelector(startElement, targetSelector, stopSelector = null) {
    const visited = new Set();

    // Argument validation
    if (!(startElement instanceof Element)) {
        throw new TypeError('The first argument must be a DOM Element.');
    }
    if (typeof targetSelector !== 'string' || targetSelector.trim() === '') {
        throw new TypeError('The second argument must be a non-empty string.');
    }

    // Check the startElement first
    if (startElement.matches(targetSelector)) {
        return startElement;
    }

    visited.add(startElement);

    let currentElement = startElement;

    // Begin DOM traversal
    while (currentElement) {
        const parent = currentElement.parentElement;
        if (parent) {
            let sibling = parent.firstElementChild;

            // Search among siblings
            while (sibling) {
                if (!visited.has(sibling)) {
                    visited.add(sibling);

                    if (sibling !== currentElement && sibling.matches(targetSelector)) {
                        return sibling;
                    } else {
                        // BFS for descendants
                        if (sibling.children.length > 0) {
                            const bfsQueue = [sibling.firstElementChild];
                            while (bfsQueue.length > 0) {
                                const element = bfsQueue.shift();
                                if (!visited.has(element)) {
                                    visited.add(element);

                                    if (element.matches(targetSelector)) {
                                        return element;
                                    }

                                    let nextSibling = element.nextElementSibling;
                                    while (nextSibling) {
                                        bfsQueue.push(nextSibling);
                                        nextSibling = nextSibling.nextElementSibling;
                                    }

                                    if (element.firstElementChild) {
                                        bfsQueue.push(element.firstElementChild);
                                    }
                                }
                            }
                        }
                    }
                }
                sibling = sibling.nextElementSibling;
            }
        }

        // Ascend to the parent element
        currentElement = parent;

        if (currentElement && !visited.has(currentElement)) {
            visited.add(currentElement);

            // Check the parent
            if (currentElement.matches(targetSelector)) {
                return currentElement;
            }

            // Check if traversal should be stopped
            if (stopSelector && currentElement.matches(stopSelector)) {
                break;
            }
        }
    }

    // If no matching element is found
    return null;
}

export function notBasePage(url) {
    const slashCount = (url.match(/\//g) || []).length;

    /* If there's more than one slash or only one but not at the end */
    return !(slashCount > 1 || (slashCount === 1 && url.charAt(url.length - 1) !== '/'));
}

export function sanitize(string) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#x27;',
        "/": '&#x2F;',
        '`': '&#x60;',
        '=': '&#x3D;',
        ' ': '&nbsp;'
    };
    const reg = /[&<>"'/]/ig;
    return string.replace(reg, (match) => (map[match]));
}

export function getMainAppContainer(element) {
    return getClosestParentElement(element, ".app-container");
}


