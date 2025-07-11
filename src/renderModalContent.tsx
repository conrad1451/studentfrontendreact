import React from "react";

import { Typography } from "@mui/material";

const renderModalContent1 = (content: string) => {
  const parts = content.split(/\[-n-\]/);
  return (
    <>
      {parts.map((part, index) => {
        if (part.includes("[h1]")) {
          return (
            <Typography
              key={index}
              variant="h3"
              component="h3"
              className="myTable-modalHeading1"
              fontWeight="bold"
            >
              {part
                .split("[h1]")
                .filter(Boolean)
                .map((textPart, i) => (
                  <React.Fragment key={i}>{textPart}</React.Fragment>
                ))}
            </Typography>
          );
        } else if (part.includes("[h2]")) {
          return (
            <Typography
              key={index}
              variant="h4"
              component="h4"
              className="myTable-modalHeading2"
              fontWeight="bold"
            >
              {part
                .split("[h2]")
                .filter(Boolean)
                .map((textPart, i) => (
                  <React.Fragment key={i}>{textPart}</React.Fragment>
                ))}
            </Typography>
          );
        } else if (part.includes("[h3]")) {
          return (
            <Typography
              key={index}
              variant="h5"
              component="h5"
              className="myTable-modalHeading3"
              fontWeight="bold"
            >
              {part
                .split("[h3]")
                .filter(Boolean)
                .map((textPart, i) => (
                  <React.Fragment key={i}>{textPart}</React.Fragment>
                ))}
            </Typography>
          );
        } else {
          return (
            <Typography
              key={index}
              component="p"
              className="myTable-modalParagraph"
              fontWeight="regular"
            >
              {part
                .split("[p]")
                .filter(Boolean)
                .map((textPart, i) => (
                  <React.Fragment key={i}>{textPart}</React.Fragment>
                ))}
            </Typography>
          );
        }
      })}
    </>
  );
};
export default renderModalContent1;
