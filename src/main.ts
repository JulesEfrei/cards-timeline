import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

const FINAL_POS: Array<number>[] = [
  [-140, -140],
  [-40, 130],
  [-160, 40],
  [20, 30],
];

function animation() {
  config();

  const images = document.querySelectorAll(".cards-timeline-image");

  ScrollTrigger.create({
    trigger: ".cards-timeline",
    start: "top top",
    end: `+${window.innerHeight * 6}px`,
    pin: true,
    pinSpacing: true,
    scrub: 1,
    onUpdate: (self) => {
      const progress = self.progress;

      const initialRotations = [5, -3, 3.5, -1];
      const staggerPoints = [0, 0.1, 0.2, 0.3];

      images.forEach((image, index) => {
        const initialRotation = initialRotations[index];
        const startTime = staggerPoints[index];
        //We create an easing based on the starting time
        const endTime = Math.min(startTime + (0.45 - startTime) * 0.9, 0.45);

        //Transform values
        let x = -50;
        let y, rotation;

        if (progress <= startTime) {
          y = 200;
          rotation = initialRotation;
        } else if (progress <= 0.45) {
          let localProgress;

          if (progress >= endTime) {
            localProgress = 1;
          } else {
            const linearProgress =
              (progress - startTime) / (endTime - startTime);
            //cubic curve
            localProgress = 1 - Math.pow(1 - linearProgress, 3);
          }

          y = 200 - localProgress * 250;
          rotation = initialRotation;
        } else {
          y = -50;
          rotation = initialRotation;
        }

        gsap.set(image, {
          transform: `translate(${x}%, ${y}%) rotate(${rotation}deg)`,
        });
      });
    },
  });
}

function config() {
  gsap.registerPlugin(ScrollTrigger);

  const lenis = new Lenis();
  lenis.on("scroll", ScrollTrigger.update);
  gsap.ticker.add((time) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);
}

document.addEventListener("DOMContentLoaded", animation);
