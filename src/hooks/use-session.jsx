import useUserStore from "@/lib/AuthZustand";
import { responseHandler } from "@/lib/utils";
import { ServiceSession, ServiceSessions } from "@/Services/Auth/Auth.services";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

const useSession = (secretCode) => {
  const [loading, setLoading] = useState(false);
  const { user, setUser } = useUserStore();
  const fetchSession = async () => {
    setLoading(true);

    try {
      if (secretCode) {
        const response = await ServiceSessions(secretCode);
        setUser(response.data);
        return;
      } else {

        const response = await ServiceSession(localStorage.getItem("token"));
        setUser(response.data);
      }
    } catch (error) {
      responseHandler(error);

    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSession();
  }, []);
  return { loading, fetchSession, user };
};

export default useSession;
