import { useRef, useState, useEffect } from 'react';
import './Carousel.css';

function Carousel({ children }) {
    const carouselRef = useRef(null);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(true);

    const updateScrollButtons = () => {
        const el = carouselRef.current;
        if (el) {
            setCanScrollLeft(el.scrollLeft > 0);
            setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 5);
        }
    };

    const scroll = (direction) => {
        const el = carouselRef.current;
        if (!el) return;

        const scrollAmount = direction === 'left' ? -300 : 300;
        el.scrollBy({ left: scrollAmount, behavior: 'smooth' });

        // Wait a bit then update scroll button state
        setTimeout(updateScrollButtons, 400);
    };

    useEffect(() => {
        const el = carouselRef.current;
        if (el) {
            el.addEventListener('scroll', updateScrollButtons);
            updateScrollButtons();
        }

        return () => {
            if (el) el.removeEventListener('scroll', updateScrollButtons);
        };
    }, []);

    return (
        <div className="carousel-container">
            <button
                className="carousel-button left"
                onClick={() => scroll('left')}
                disabled={!canScrollLeft}
            >
                ◀
            </button>

            <div className="carousel" ref={carouselRef}>
                {children}
            </div>

            <button
                className="carousel-button right"
                onClick={() => scroll('right')}
                disabled={!canScrollRight}
            >
                ▶
            </button>
        </div>
    );
}

export default Carousel;
