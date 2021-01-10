import { useTable } from "hooks/useTable";
import { useHeader } from "hooks/useHeader";
import React, { useEffect, useState } from "react";
import {
  Button,
  Card,
  CardContent,
  Container,
  Grid,
  Typography,
} from "@material-ui/core";
import useTranslation from "next-translate/useTranslation";
import { getList } from "services";
import { KeyboardDatePicker } from "@material-ui/pickers";
import moment from "moment";
import { Order, Role, Status, Type } from "models";
import { DisplayPrice } from "components/DisplayPrice";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { RootState } from "stores";

const name = "dashboard";

interface Summary {
  totalInputPrice: number;
  totalOutputPrice: number;
  totalProducePrice: number;
  totalInputOrder: number;
  totalOutputOrder: number;
  totalProduceOrder: number;
  totalInputNotpaid: number;
  totalOutputNotpaid: number;
  totalProduceNotpaid: number;
  totalInputNotpaidPrice: number;
  totalOutputNotpaidPrice: number;
  totalProduceNotpaidPrice: number;
  totalCosts: number;
  totalWaste: number;
  provisionalProfit: number;
}

const DashBoard = () => {
  const router = useRouter();
  const user = useSelector((state: RootState) => state.user);
  if (user?.role === Role.MEMBER) {
    router.push("/order");
  }
  if (!user || !user.role || user.role !== Role.ADMIN) {
    return null;
  }
  const { t } = useTranslation("common");

  const [fromDate, setFromDate] = useState<moment.Moment | null>(moment());
  const [toDate, setToDate] = useState<moment.Moment | null>(moment());
  const [orders, setOrders] = useState<Order[]>([]);
  const [summary, setSummary] = useState<Summary>();
  const title = t(name);

  const onSelectFromDate = (date: moment.Moment | null) => {
    setFromDate(date);
  };
  const onSelectToDate = (date: moment.Moment | null) => {
    setToDate(date);
  };

  const getListOrder = () => {
    const startDate = fromDate?.clone().utcOffset(7);
    const endDate = toDate?.clone().utcOffset(7);
    getList("order", {
      fromDate: startDate
        ?.set({ hour: 0, minute: 0, second: 0, millisecond: 0 })
        .toISOString(),
      toDate: endDate
        ?.set({ hour: 24, minute: 0, second: 0, millisecond: 0 })
        .toISOString(),
    }).then((res) => {
      setOrders(res?.data || []);
    });
  };

  useEffect(() => {
    const newSummary: Summary = {
      totalInputPrice: 0,
      totalOutputPrice: 0,
      totalProducePrice: 0,
      totalInputOrder: 0,
      totalOutputOrder: 0,
      totalProduceOrder: 0,
      totalInputNotpaid: 0,
      totalOutputNotpaid: 0,
      totalProduceNotpaid: 0,
      totalInputNotpaidPrice: 0,
      totalOutputNotpaidPrice: 0,
      totalProduceNotpaidPrice: 0,
      totalCosts: 0,
      totalWaste: 0,
      provisionalProfit: 0,
    };
    if (orders && orders.length) {
      orders.forEach((order) => {
        if (order.type === Type.Input) {
          newSummary.totalInputOrder++;
          newSummary.totalInputPrice += order.totalPrice || 0;
          if (order.status === Status.Unpaid) {
            newSummary.totalInputNotpaid++;
            newSummary.totalInputNotpaidPrice += order.totalPrice || 0;
          }
        }
        if (order.type === Type.Output) {
          newSummary.totalOutputOrder++;
          newSummary.totalOutputPrice += order.totalPrice || 0;
          if (order.status === Status.Unpaid) {
            newSummary.totalOutputNotpaid++;
            newSummary.totalOutputNotpaidPrice += order.totalPrice || 0;
          }
          newSummary.provisionalProfit += order.profit || 0;
        }
        if (order.type === Type.Produce) {
          newSummary.totalProduceOrder++;
          newSummary.totalProducePrice += order.totalPrice || 0;
          if (order.status === Status.Unpaid) {
            newSummary.totalProduceNotpaid++;
            newSummary.totalProduceNotpaidPrice += order.totalPrice || 0;
          }
          newSummary.totalWaste += order.waste || 0;
        }
        newSummary.totalCosts += order.costs || 0;
      });
    }

    setSummary(newSummary);
  }, [orders]);
  return (
    <Container>
      <h2>{title}</h2>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <KeyboardDatePicker
            disableToolbar
            variant="inline"
            format="DD/MM/YYYY"
            margin="normal"
            id="fromDate"
            label={t("from date")}
            value={fromDate}
            onChange={onSelectFromDate}
            fullWidth={true}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <KeyboardDatePicker
            disableToolbar
            variant="inline"
            format="DD/MM/YYYY"
            margin="normal"
            id="toDate"
            label={t("to date")}
            value={toDate}
            onChange={onSelectToDate}
            fullWidth={true}
          />
        </Grid>
        <Grid item xs={12} sm={12}>
          <Button color="primary" variant="contained" onClick={getListOrder}>
            {t("apply")}
          </Button>
        </Grid>
      </Grid>
      <Grid container spacing={4}>
        <Grid item xs={12} sm={6} md={4}>
          <Card variant="outlined">
            <CardContent>
              <Typography variant="h5" component="h2">
                {t("total")}
              </Typography>
              <Typography color="textSecondary">
                {t("summary infomations")}
              </Typography>
              <Typography variant="body2" component="p">
                {t("total costs")}:{" "}
                <DisplayPrice value={summary?.totalCosts || 0} />
              </Typography>
              <Typography variant="body2" component="p">
                {t("total waste")}:{" "}
                <DisplayPrice value={summary?.totalWaste || 0} />
              </Typography>
              <Typography variant="body2" component="p">
                {t("provisional profit")}:{" "}
                <DisplayPrice value={summary?.provisionalProfit || 0} />
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Card variant="outlined">
            <CardContent>
              <Typography variant="h5" component="h2">
                {t("type input")}
              </Typography>
              <Typography color="textSecondary">
                {t("input infomations")}
              </Typography>
              <Typography variant="body2" component="p">
                {t("total order")}: {summary?.totalInputOrder}
              </Typography>
              <Typography variant="body2" component="p">
                {t("total price")}:{" "}
                <DisplayPrice value={summary?.totalInputPrice || 0} />
              </Typography>
              <Typography variant="body2" component="p">
                {t("total unpaid")}:{" "}
                <DisplayPrice value={summary?.totalInputNotpaidPrice || 0} />
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Card variant="outlined">
            <CardContent>
              <Typography variant="h5" component="h2">
                {t("type output")}
              </Typography>
              <Typography color="textSecondary">
                {t("output infomations")}
              </Typography>
              <Typography variant="body2" component="p">
                {t("total order")}: {summary?.totalOutputOrder}
              </Typography>
              <Typography variant="body2" component="p">
                {t("total price")}:{" "}
                <DisplayPrice value={summary?.totalOutputPrice || 0} />
              </Typography>
              <Typography variant="body2" component="p">
                {t("total unpaid")}:{" "}
                <DisplayPrice value={summary?.totalOutputNotpaidPrice || 0} />
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Card variant="outlined">
            <CardContent>
              <Typography variant="h5" component="h2">
                {t("type produce")}
              </Typography>
              <Typography color="textSecondary">
                {t("produce infomations")}
              </Typography>
              <Typography variant="body2" component="p">
                {t("total order")}: {summary?.totalProduceOrder}
              </Typography>
              <Typography variant="body2" component="p">
                {t("total price")}:{" "}
                <DisplayPrice value={summary?.totalProducePrice || 0} />
              </Typography>
              <Typography variant="body2" component="p">
                {t("total unpaid")}:{" "}
                <DisplayPrice value={summary?.totalProduceNotpaidPrice || 0} />
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};
export default DashBoard;
