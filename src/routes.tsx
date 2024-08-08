import { Route, Routes } from "react-router";
import { PrivateRoute } from "./privateRoutes";
import React from 'react';
import {
  AddAdminsPage,
  AddContactDetailsPage,
  AddCurrencyPage,
  AddPaymentAccountPage,
  AddDeliveryChargePage,
  AddDeliveryHoursPage,
  AddMinimumOrderAmountPage,
  AddNoticeTextPage,
  ArchivedOrderedItemsPage,
  ArchivedOrdersPage,
  ChangeCeoEmailPage,
  ChangePasswordPage,
  ChooseOrderForAppPage,
  ForgotPasswordPage,
  HomePage,
  ListAnItemPage,
  ListOfAdminsPage,
  ListOfItemsCardsPage,
  ListOfSuperAdminsPage,
  ListOfUsersPage,
  LoginPage,
  OrderedItemsPage,
  ResetPasswordPage,
  RouteNotFoundPage,
  TodaysOrdersPage,
  AddBranchBoundaryPage
} from "./pages";
import GenerateUsers from "./pages/GenerateUsers";
function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />
      <Route
        path="/"
        element={
          <PrivateRoute>
            <HomePage />
          </PrivateRoute>
        }
      />
      <Route
        path="/change-password"
        element={
          <PrivateRoute>
            <ChangePasswordPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/add-admins"
        element={
          <PrivateRoute>
            <AddAdminsPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/add-super-admins"
        element={
          <PrivateRoute>
            <AddAdminsPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/list-of-admins"
        element={
          <PrivateRoute>
            <ListOfAdminsPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/list-of-super-admins"
        element={
          <PrivateRoute>
            <ListOfSuperAdminsPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/generate-users"
        element={
          <PrivateRoute>
            <GenerateUsers />
          </PrivateRoute>
        }
      />
      <Route
        path="/list-of-users"
        element={
          <PrivateRoute>
            <ListOfUsersPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/list-item"
        element={
          <PrivateRoute>
            <ListAnItemPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/change-currency"
        element={
          <PrivateRoute>
            <AddCurrencyPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/change-payment-account"
        element={
          <PrivateRoute>
            <AddPaymentAccountPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/add-delivery-charge"
        element={
          <PrivateRoute>
            <AddDeliveryChargePage />
          </PrivateRoute>
        }
      />
      <Route
        path="/add-minimum-order-amount"
        element={
          <PrivateRoute>
            <AddMinimumOrderAmountPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/modify-footer"
        element={
          <PrivateRoute>
            <AddContactDetailsPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/add-notice-text"
        element={
          <PrivateRoute>
            <AddNoticeTextPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/add-branch-boundary"
        element={
          <PrivateRoute>
            <AddBranchBoundaryPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/time-zone"
        element={
          <PrivateRoute>
            <AddDeliveryHoursPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/listed-items"
        element={
          <PrivateRoute>
            <ListOfItemsCardsPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/choose-order-for-app"
        element={
          <PrivateRoute>
            <ChooseOrderForAppPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/get-todays-orders"
        element={
          <PrivateRoute>
            <TodaysOrdersPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/todays-ordered-items"
        element={
          <PrivateRoute>
            <OrderedItemsPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/archived-orders"
        element={
          <PrivateRoute>
            <ArchivedOrdersPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/archived-ordered-items"
        element={
          <PrivateRoute>
            <ArchivedOrderedItemsPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/change-ceo-email"
        element={
          <PrivateRoute>
            <ChangeCeoEmailPage />
          </PrivateRoute>
        }
      />

      <Route path="*" element={<RouteNotFoundPage />} />
    </Routes>
  );
}

export default AppRoutes;
