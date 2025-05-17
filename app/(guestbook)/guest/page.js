import ToastEditor from "@components/common/ToastEditor";
import GuestbookList from "@components/guestbook/GuestbookList";
import { useUserStore } from "@store/UserStore";

export default function GuestHomePage() {
  return (
    <>
      <GuestbookList />
    </>
  );
}
