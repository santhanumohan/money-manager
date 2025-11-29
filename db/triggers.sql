-- Function to update wallet balance
CREATE OR REPLACE FUNCTION update_wallet_balance()
RETURNS TRIGGER AS $$
BEGIN
  -- Handle INSERT
  IF (TG_OP = 'INSERT') THEN
    IF (NEW.type = 'income') THEN
      UPDATE wallets SET balance = balance + NEW.amount WHERE id = NEW.wallet_id;
    ELSIF (NEW.type = 'expense') THEN
      UPDATE wallets SET balance = balance - NEW.amount WHERE id = NEW.wallet_id;
    ELSIF (NEW.type = 'transfer') THEN
      UPDATE wallets SET balance = balance - NEW.amount WHERE id = NEW.wallet_id;
      UPDATE wallets SET balance = balance + NEW.amount WHERE id = NEW.target_wallet_id;
    END IF;
    RETURN NEW;

  -- Handle DELETE
  ELSIF (TG_OP = 'DELETE') THEN
    IF (OLD.type = 'income') THEN
      UPDATE wallets SET balance = balance - OLD.amount WHERE id = OLD.wallet_id;
    ELSIF (OLD.type = 'expense') THEN
      UPDATE wallets SET balance = balance + OLD.amount WHERE id = OLD.wallet_id;
    ELSIF (OLD.type = 'transfer') THEN
      UPDATE wallets SET balance = balance + OLD.amount WHERE id = OLD.wallet_id;
      UPDATE wallets SET balance = balance - OLD.amount WHERE id = OLD.target_wallet_id;
    END IF;
    RETURN OLD;

  -- Handle UPDATE
  ELSIF (TG_OP = 'UPDATE') THEN
    -- Revert OLD transaction effect
    IF (OLD.type = 'income') THEN
      UPDATE wallets SET balance = balance - OLD.amount WHERE id = OLD.wallet_id;
    ELSIF (OLD.type = 'expense') THEN
      UPDATE wallets SET balance = balance + OLD.amount WHERE id = OLD.wallet_id;
    ELSIF (OLD.type = 'transfer') THEN
      UPDATE wallets SET balance = balance + OLD.amount WHERE id = OLD.wallet_id;
      UPDATE wallets SET balance = balance - OLD.amount WHERE id = OLD.target_wallet_id;
    END IF;

    -- Apply NEW transaction effect
    IF (NEW.type = 'income') THEN
      UPDATE wallets SET balance = balance + NEW.amount WHERE id = NEW.wallet_id;
    ELSIF (NEW.type = 'expense') THEN
      UPDATE wallets SET balance = balance - NEW.amount WHERE id = NEW.wallet_id;
    ELSIF (NEW.type = 'transfer') THEN
      UPDATE wallets SET balance = balance - NEW.amount WHERE id = NEW.wallet_id;
      UPDATE wallets SET balance = balance + NEW.amount WHERE id = NEW.target_wallet_id;
    END IF;
    RETURN NEW;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Trigger definition
DROP TRIGGER IF EXISTS trg_update_wallet_balance ON transactions;
CREATE TRIGGER trg_update_wallet_balance
AFTER INSERT OR UPDATE OR DELETE ON transactions
FOR EACH ROW
EXECUTE FUNCTION update_wallet_balance();
