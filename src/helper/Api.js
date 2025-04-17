/* eslint-disable */
import { addInstance } from "./instacnes";

//get data from component and fetch it in api
export const addData = async (data) => {
  try {
    let response = await addInstance.request({ data });
    return response;
  } catch (e) {
    throw new Error(e.message);
  }
};
