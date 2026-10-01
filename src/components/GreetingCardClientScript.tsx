import { raw } from "hono/html";
import { cardClientScript } from "../cards/client";

export function GreetingCardClientScript() {
  return <script>{raw(cardClientScript)}</script>;
}
