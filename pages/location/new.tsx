import { useEditData } from "hooks/useEditData";

import TagForm from "./Form";
import { name } from "./";

const New = () => {
  const { EditForm } = useEditData(name, TagForm);

  return EditForm;
};

export default New;
