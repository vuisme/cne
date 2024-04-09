import { useMediaQuery } from "react-responsive";

const useResponsive = () => {

    const isDesktop = useMediaQuery({ query: "(min-width: 1200px)" });
    const isLaptop = useMediaQuery({ query: "(max-width: 1199px)" });
    const isTablet = useMediaQuery({ query: "(max-width: 992px)" });
    const isMobile = useMediaQuery({ query: "(max-width: 768px)" });
    const isMobileSmall = useMediaQuery({ query: "(max-width: 576px)" });

    return {
        isMobileSmall,
        isMobile,
        isTablet,
        isLaptop,
        isDesktop
    }
}

export default useResponsive