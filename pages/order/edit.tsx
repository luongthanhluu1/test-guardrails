import { useEditData } from "hooks/useEditData";

import Form from "./Form";
import { name } from "./";

const New = () => {
  const { EditForm } = useEditData(name, Form);

  return EditForm;
};

export default New;
