import { useEditData } from "hooks/useEditData";

import { name } from "./";
import Form from "./Form";

const New = () => {
  const { EditForm } = useEditData(name, Form);

  return EditForm;
};

export default New;
