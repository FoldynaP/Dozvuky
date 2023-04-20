
export const init = () => {
    const parallax = document.querySelector(".js-parallax-container");
    if (!parallax) return;
    let path = document.querySelector("path");
    let pathLenght = path.getTotalLength();

    path.style.strokeDasharray = pathLenght + " " + pathLenght;

    path.style.strokeDashoffset = pathLenght;

    document.addEventListener("scroll", () => {
      const scrollPercentage =
        (document.documentElement.scrollTop + document.body.scrollTop) /
        (document.documentElement.scrollHeight -
          document.documentElement.clientHeight);

      const drawLenght = pathLenght * scrollPercentage;

      path.style.strokeDashoffset = pathLenght - drawLenght;
    });
};
