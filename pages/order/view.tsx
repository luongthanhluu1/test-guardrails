import { useEditData } from "hooks/useEditData";

import Form from "./Form";
import { name } from "./";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import useTranslation from "next-translate/useTranslation";
import { getById } from "services";
import {
  Checkbox,
  Container,
  FormControlLabel,
  Grid,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@material-ui/core";
import { Loading } from "components/Loading";
import { Order, Status, Type } from "models";
import { DisplayPrice } from "components/DisplayPrice";
import { useFormatDate } from "hooks/useFormatDate";
import { useStyles } from "./styles";
import { Check, Edit } from "@material-ui/icons";
import { StatusText } from "components/Status";

const New = () => {
  const classes = useStyles();
  const router = useRouter();
  const { query } = router;
  const { id } = query;
  const [data, setData] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation("common");
  const title = `${t("view")} ${t(name)}`;
  const date = useFormatDate(data?.date || "");
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
  return (
    <Container>
      <div className={classes.title}>
        <h2>{title}</h2>
        {data?.status !== Status.Completed && (
          <IconButton aria-label="edit" href={`/${name}/edit?id=${id}`}>
            <Edit color="primary" />
          </IconButton>
        )}
      </div>
      {loading ? (
        <Loading />
      ) : (
        <>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={12}>
              <p>
                {t("date")}: {date}
              </p>
              <p>
                {t("type")}: {t("type " + data?.type)}
              </p>
              {data?.type === Type.Produce && (
                <p>
                  {t("location")}: {data?.locationFrom?.name}
                </p>
              )}
              {data?.type === Type.Output && (
                <p>
                  {t("customer")}: {data?.customer?.name}
                </p>
              )}
              <p>
                {t("status")}:{" "}
                <StatusText status={data?.status || Status.Waiting} />
              </p>
              <p>
                {t("manager warehouse")}:{" "}
                {data?.isWarehouse ? <Check color="primary" /> : t("no")}
              </p>
              <p>{t("note") + ": " + data?.note}</p>
            </Grid>
          </Grid>
          <Grid container spacing={2}></Grid>
          <Grid container spacing={2}>
            {data?.items && data?.items?.length ? (
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>{t("name")}</TableCell>
                      <TableCell>{t("tag")}</TableCell>
                      <TableCell>{t("quantily")}</TableCell>
                      <TableCell></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {data.items.map((item, index) => (
                      <TableRow key={item._id}>
                        <TableCell component="th" scope="row">
                          {item.name}
                        </TableCell>
                        <TableCell>
                          {item.tags?.map((tag) => tag.name).join(", ")}
                        </TableCell>
                        <TableCell>{item.quantily}</TableCell>
                        <TableCell>
                          <DisplayPrice
                            value={
                              item.quantily * parseInt(`${item.price}`, 10)
                            }
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                    <TableRow key={"total"}>
                      <TableCell></TableCell>
                      <TableCell></TableCell>
                      <TableCell>
                        <p>{t("costs")}</p>
                        <p>{t("promo")}</p>
                        <p>{t("waste")}</p>
                        <p className={classes.totalText}>{t("total")}</p>
                      </TableCell>
                      <TableCell>
                        <p>
                          <DisplayPrice value={data?.costs || 0} />
                        </p>
                        <p>
                          <DisplayPrice value={data?.promo || 0} />
                        </p>
                        <p>
                          <DisplayPrice value={data?.waste || 0} />
                        </p>
                        <p className={classes.totalText}>
                          <DisplayPrice value={data?.totalPrice || ""} />
                        </p>
                      </TableCell>
                      <TableCell></TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            ) : null}
          </Grid>
          <Grid container spacing={2} className={classes.group}>
            {/* <Grid item xs={12} sm={12}>
              <TextField
                id="costs"
                label={t("costs")}
                value={costs}
                onChange={(e) => setCosts(e.target.value)}
                fullWidth={true}
                variant="outlined"
                InputProps={{
                  inputComponent: PriceInputFormat,
                }}
              />
            </Grid>
            <Grid item xs={12} sm={12}>
              <TextField
                id="promo"
                label={t("promo")}
                value={promo}
                onChange={(e) => setPromo(e.target.value)}
                fullWidth={true}
                variant="outlined"
                InputProps={{
                  inputComponent: PriceInputFormat,
                }}
              />
            </Grid> */}
          </Grid>
        </>
      )}
    </Container>
  );
};

export default New;
