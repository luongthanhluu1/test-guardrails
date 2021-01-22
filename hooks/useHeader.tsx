import React from "react";
import { Edit, Delete, AddBox, Visibility } from "@material-ui/icons";
import { IconButton, makeStyles } from "@material-ui/core";
import useTranslation from "next-translate/useTranslation";
import { confirmAlert } from "react-confirm-alert";

import { deleteAll } from "services";

const useStyles = makeStyles({
  container: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  success: {
    color: "green",
  },
});

interface Options {
  selected?: (string | number)[];
  onAfterDeleted?: (count: number) => void;
  viewable?: boolean;
  unableDelete?: boolean;
  unableaAdd?: boolean;
  title?: string;
}

export const useHeader = (name: string, options?: Options) => {
  const classes = useStyles();
  const { t } = useTranslation("common");
  console.log(options);
  const pageTitle = options?.title || t(name);

  const onClickDelete = () => {
    const options = {
      title: t("delete"),
      message: t("are you sure delete?"),
      buttons: [
        {
          label: t("yes"),
          onClick: () => deleteSeleted(),
        },
        {
          label: t("no"),
          onClick: () => {},
        },
      ],
    };

    confirmAlert(options);
  };
  const deleteSeleted = () => {
    if (options?.selected && options.selected && options.selected.length) {
      deleteAll(name, options.selected).then((res) => {
        options?.onAfterDeleted
          ? options?.onAfterDeleted(res?.data?.deletedCount)
          : null;
      });
    }
  };

  const Header = (
    <div className={classes.container}>
      <h2>{pageTitle}</h2>
      <div>
        {!options?.unableaAdd && (
          <IconButton aria-label="edit" href={`/${name}/new`}>
            <AddBox className={classes.success} />
          </IconButton>
        )}
        {options && options.selected?.length === 1 && (
          <>
            {options.viewable && (
              <IconButton
                aria-label="edit"
                href={`/${name}/view?id=${options.selected[0]}`}
              >
                <Visibility color="primary" />
              </IconButton>
            )}

            <IconButton
              aria-label="edit"
              href={`/${name}/edit?id=${options.selected[0]}`}
            >
              <Edit color="primary" />
            </IconButton>
          </>
        )}
        {options &&
          options.selected &&
          options.selected?.length > 0 &&
          !options.unableDelete && (
            <IconButton aria-label="delete" onClick={onClickDelete}>
              <Delete color="error" />
            </IconButton>
          )}
      </div>
    </div>
  );
  return { Header };
};
