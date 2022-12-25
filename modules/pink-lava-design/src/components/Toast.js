import { Button, notification } from 'antd';
import { SmileOutlined } from '@ant-design/icons';
import { ReactElement as Exclamation} from "../assets/exclamation.svg"

const openNotification = () => {
    const args = {
      message: 'Put your information here',
      description: "",
      duration: 0,
      // icon: <Exclamation style={{ color: 'white' }} />
    };
    notification.open(args);
  };

export const Toast = () => {
  return (
    <Button type="primary" onClick={openNotification}>
        Open the notification box
    </Button>
  )
}