import styled from "@emotion/styled";
import * as fs from "fs";

export default styled.div(
  ({
    imagePath,
    imageExtension
  }: {
    imagePath: string;
    imageExtension: string;
  }) => ({
    backgroundImage: `url(  data:image/${imageExtension};base64,${fs
      .readFileSync(imagePath)
      .toString("base64")})`,
    backgroundSize: "cover",
    backgroundPosition: "center center",
    backgroundRepeat: "no-repeat"
  })
);
