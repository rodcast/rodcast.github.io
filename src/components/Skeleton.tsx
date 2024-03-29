import { FC } from "react";
import { ISkeleton } from "@/interfaces/index";
import styles from "@/styles/skeleton.module.css";

const Skeleton: FC<ISkeleton> = ({ width, height, marginBottom = "0" }) => {
  const style = {
    width,
    height,
    marginBottom,
  };

  return <div className={styles.animation} style={style} />;
};

export default Skeleton;
