// components/Button.js

import React from "react";
import { Button } from '@chakra-ui/react'

export default function Control(props) {
  let { action, title } = props;
  return <Button size='lg' onClick={action}>{title}</Button>;
}
