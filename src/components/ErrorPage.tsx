import { useRouteError } from "react-router-dom";
import { z } from "zod";

const zErrorWithOptionalStatusText = z.object({
  message: z.string().optional(),
  statusText: z.string().optional(),
});

export default function ErrorPage() {
  const error = useRouteError();
  console.error(error);

  const parsedError = zErrorWithOptionalStatusText.safeParse(error);

  return (
    <div id="error-page">
      <h1>Oops!</h1>
      <p>Sorry, an unexpected error has occurred.</p>
      {parsedError.success && (
        <p>
          <i>{parsedError.data.statusText || parsedError.data.message}</i>
        </p>
      )}
    </div>
  );
}
