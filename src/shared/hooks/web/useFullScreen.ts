export const useFullScreen = () => {

    const openFullScreen = (element: any = document.documentElement) => {
        if (element.requestFullscreen) {
            element.requestFullscreen();
        } else if (element.webkitRequestFullScreen) {
            element.webkitRequestFullScreen();
        } else if (element.mozRequestFullScreen) {
            element.mozRequestFullScreen();
        } else if (element.msRequestFullscreen) {
            // IE11
            element.msRequestFullscreen();
        }
    };

    const closeFullScreen = () => {
        const _document = document as any;
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (_document.webkitCancelFullScreen) {
            _document.webkitCancelFullScreen();
        } else if (_document.mozCancelFullScreen) {
            _document.mozCancelFullScreen();
        } else if (_document.msExitFullscreen) {
            _document.msExitFullscreen();
        }
    };

    return {
        openFullScreen,
        closeFullScreen
    };
};
