import { Container } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import useTranslation from "next-translate/useTranslation";
import { useRouter } from "next/router";
import { toast } from "react-toastify";

import { Product, Tag } from "models";
import { getById, create, update } from "services";

import { Loading } from "components/Loading";
import { useStyles } from "./styles";

export const useEditData = (name: string, Form: any, disableEdit = false) => {
  const classes = useStyles();
  const router = useRouter();
  const { query } = router;
  const { id } = query;
  const [data, setData] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [submiting, setSubmiting] = useState(false);
  const { t } = useTranslation("common");
  const title = `${t(id ? "edit" : "create")} ${t(name)}`;
  useEffect(() => {
    if (id) {
      setLoading(true);
      getById(name, `${id}`).then((res: any) => {
        if (res.data) {
          setData(res.data);
        }
        setLoading(false);
      });
    }
  }, [id]);

  const afterSave = () => {
    toast.success(t("success"));
    router.push(`/${name}`);
  };

  const onError = (error: any) => {
    console.log(error.response);
    let message =
      error?.response?.data?.data?.message ||
      error?.response?.data?.message ||
      error?.response?.message ||
      "ERR_SOMETHING_WRONG";
    toast.error(t(message));
    setSubmiting(false);
  };

  const onSave = (data: Product | Tag) => {
    setSubmiting(true);
    if (id) {
      return update(name, { ...data, _id: `${id}` }).then(afterSave, onError);
    } else {
      return create(name, data).then(afterSave, onError);
    }
  };

  const EditForm = (
    <Container>
      <h2 className={classes.title}>{title}</h2>
      {loading ? (
        <Loading />
      ) : (
        <Form
          data={data || undefined}
          onSave={onSave}
          disableEdit={disableEdit}
          submiting={submiting}
        />
      )}
    </Container>
  );
  return { EditForm };
};
