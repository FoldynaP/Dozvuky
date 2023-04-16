
export const init = () => {
    let path = document.querySelector("path");
    let pathLenght = path.getTotalLength();

    path.style.strokeDasharray = pathLenght + " " + pathLenght;

    path.style.strokeDashoffset = pathLenght;

    window.addEventListener("scroll", () => {
      var scrollPercentage =
        (document.documentElement.scrollTop + document.body.scrollTop) /
        (document.documentElement.scrollHeight -
          document.documentElement.clientHeight);

      var drawLenght = pathLenght * scrollPercentage;

      path.style.strokeDashoffset = pathLenght - drawLenght;
    });
};
