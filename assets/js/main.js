(function () {
    pagination(true);

    // Handle cover image loading animation
    const coverImage = document.querySelector('.gh-cover-image');
    if (coverImage) {
        const removeCoverLoading = function () {
            const coverSection = coverImage.closest('.gh-cover');
            if (coverSection) {
                coverSection.classList.remove('loading');
            }
        };

        // Check if image is already loaded (cached)
        if (coverImage.complete) {
            removeCoverLoading();
        } else {
            // Listen for load event for images not yet loaded
            coverImage.addEventListener('load', removeCoverLoading);
        }
    }
})();
