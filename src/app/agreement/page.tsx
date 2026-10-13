import { safeNextPath } from "@/app/utils/safeNextPath";
import AgreementForm from "./AgreementForm";

export default async function AgreementPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  return <AgreementForm next={safeNextPath((await searchParams).next, "/")} />;
}
