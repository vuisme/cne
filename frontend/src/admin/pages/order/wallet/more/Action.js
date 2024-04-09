import { Button, Menu } from "antd";

const Action = ({ walletItem, handleActionClick, isLoading, canMasterEdit }) => {

  const { status } = walletItem;

  const btnClick = (event, option) => {
    handleActionClick(event, option, walletItem)
  }

  const menuItems = [
    {
      key: "1",
      label: (
        <Button type="text" onClick={e => btnClick(e, "view")} size="small" loading={isLoading}>
          View Details
        </Button>
      ),
    },
    {
      key: "2",
      label: (
        <Button type="text" onClick={e => btnClick(e, "tracking")} size="small" loading={isLoading}>
          Tracking Info
        </Button>
      ),
    },
  ];

  const disabledIf = ['refunded', 'delivered', 'adjusted-by-invoice'];
  if (!disabledIf.includes(status)) {
    menuItems.push({
      key: "3",
      label: (
        <Button type="text"
          onClick={e => btnClick(e, "change-status")}
          size="small"
          loading={isLoading}>
          Change status
        </Button>
      ),
    })
  }

  if (canMasterEdit) {
    menuItems.push({
      key: "4",
      label: (
        <Button type="text" onClick={e => btnClick(e, "master_edit")} size="small" loading={isLoading}>
          Master Edit
        </Button>
      ),
    })
  }


  return (
    <Menu items={menuItems} />
  );
};

export default Action;
