import { useMemo, useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "./components/ui/alert";
import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";
import * as services from "./services";
import { Spinner } from "./components/ui/spinner";
import { AlertCircleIcon, CheckCircle2Icon } from "lucide-react";

function App() {
  const [wallet, setWallet] = useState<string>("");
  const [huResult, setHuResult] = useState<services.CheckResult>();
  const [hlResult, setHlResult] = useState<services.CheckResult>();
  const [isChecking, setIsChecking] = useState(false);

  const trimmedWallet = useMemo(() => wallet.trim(), [wallet]);

  const handleCheck = async () => {
    setIsChecking(true);

    const [hu, hl] = await Promise.all([
      services.checkHyperunitAvailability(),
      services.checkHyperliquidAvailability(trimmedWallet),
    ]);

    setHuResult(hu);
    setHlResult(hl);

    setIsChecking(false);
  };

  const results = [huResult, hlResult].filter((r) => !!r);

  return (
    <div className="max-w-[400px] flex flex-col gap-6 pt-10 mx-auto">
      {results.map((res) => (
        <Alert variant={res.ok ? "default" : "destructive"}>
          {res.ok ? <CheckCircle2Icon stroke="green" /> : <AlertCircleIcon />}
          <AlertTitle>{res.title}</AlertTitle>
          <AlertDescription>{res.message}</AlertDescription>
        </Alert>
      ))}
      <div className="flex flex-col gap-4">
        <Input
          placeholder="Wallet address"
          value={wallet}
          onChange={(e) => setWallet(e.target.value)}
        />
        <Button disabled={!trimmedWallet || isChecking} onClick={handleCheck}>
          {isChecking && <Spinner />}
          Check Availability
        </Button>
      </div>
    </div>
  );
}

export default App;
