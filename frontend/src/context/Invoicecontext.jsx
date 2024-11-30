import React, { createContext, useReducer } from "react";
import axios from "axios";

const InvoiceContext = createContext();

const initialState = {
    invoices: [],
    loading: false,
    error: null,
};

const invoiceReducer = (state, action) => {
    switch (action.type) {
        case "FETCH_INVOICES_REQUEST":
            return { ...state, loading: true, error: null };
        case "FETCH_INVOICES_SUCCESS":
            return { ...state, loading: false, invoices: action.payload };
        case "FETCH_INVOICES_FAILURE":
            return { ...state, loading: false, error: action.payload };
        case "ADD_INVOICE":
            return { ...state, invoices: [...state.invoices, action.payload] };
        case "DELETE_INVOICE":
            return {
                ...state,
                invoices: state.invoices.filter((inv) => inv._id !== action.payload),
            };
        default:
            return state;
    }
};

export const InvoiceProvider = ({ children }) => {
    const [state, dispatch] = useReducer(invoiceReducer, initialState);

    const fetchInvoices = async () => {
        dispatch({ type: "FETCH_INVOICES_REQUEST" });
        try {
            const res = await axios.get("/api/invoices");
            dispatch({ type: "FETCH_INVOICES_SUCCESS", payload: res.data });
        } catch (err) {
            dispatch({ type: "FETCH_INVOICES_FAILURE", payload: err.message });
        }
    };

    const addInvoice = async (invoice) => {
        const res = await axios.post("/api/invoices", invoice);
        dispatch({ type: "ADD_INVOICE", payload: res.data });
    };

    const deleteInvoice = async (id) => {
        await axios.delete(`/api/invoices/${id}`);
        dispatch({ type: "DELETE_INVOICE", payload: id });
    };

    return (
        <InvoiceContext.Provider
            value={{
                ...state,
                fetchInvoices,
                addInvoice,
                deleteInvoice,
            }}
        >
            {children}
        </InvoiceContext.Provider>
    );
};

export default InvoiceContext;
