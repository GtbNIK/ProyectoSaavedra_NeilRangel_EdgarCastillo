import React from 'react';

const BackToTop = () => {
    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    return (
        <a href="#" className="btn btn-lg btn-primary back-to-top" onClick={scrollToTop}>
            <i className="fa fa-angle-double-up"></i>
        </a>
    );
};

export default BackToTop;