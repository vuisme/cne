import { Timeline, Typography } from "antd";
import moment from "moment";

const { Title } = Typography;



const ExceptionItems = ({ exceptions }) => {
  return (
    <>
      {exceptions.map((exception, index) => (
        <Timeline.Item
          color={exception.updated_time ? "green" : "gray"}
          index={index}
        >
          <Title type={"danger"} level={5} style={{ margin: 0 }}>{exception.tracking_status}</Title>
          {
            exception.comment &&
            <p style={{ margin: 0 }}>{exception.comment}</p>
          }
          {exception.updated_time
            ? moment(exception.updated_time).format("DD-MM-YYYY hh:mm a")
            : ""}
        </Timeline.Item>
      ))}
    </>
  );
}


const TrackingItem = ({ item }) => {
  const exceptions = item?.exceptions || [];
  return (
    <>
      {exceptions?.length > 0 && <ExceptionItems exceptions={exceptions} />}
      <Timeline.Item color={item.updated_time ? "green" : "gray"}>
        <Title level={5} style={{ margin: 0 }}>{item.tracking_status}</Title>
        {
          item.comment &&
          <p style={{ margin: 0 }}>{item.comment}</p>
        }
        {item.updated_time
          ? moment(item.updated_time).format("DD-MM-YYYY hh:mm a")
          : ""}
      </Timeline.Item>
    </>
  );
};

export default TrackingItem;
