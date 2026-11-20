import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import imageCompression from "browser-image-compression";
import HealingPhotoPage from "./HealingPhotoPage";
import {
  getHealingPhotoSession,
  uploadHealingPhoto,
} from "../../services/healingPhotoServices";

jest.mock("../../services/healingPhotoServices", () => ({
  getHealingPhotoSession: jest.fn(),
  uploadHealingPhoto: jest.fn(),
}));
jest.mock("browser-image-compression", () => ({
  __esModule: true,
  default: jest.fn(),
}));

const session = (overrides = {}) => ({
  business: { name: "Brow Studio", logoUrl: null },
  clientFirstName: "Jane",
  services: ["Microblading"],
  photosUploaded: 0,
  maxPhotos: 5,
  ...overrides,
});

const renderPage = () =>
  render(
    <MemoryRouter initialEntries={["/healing-photo/tok123"]}>
      <Routes>
        <Route path="/healing-photo/:token" element={<HealingPhotoPage />} />
      </Routes>
    </MemoryRouter>
  );

const choosePhoto = () =>
  fireEvent.change(screen.getByTestId("healing-photo-input"), {
    target: {
      files: [new File(["jpg"], "brows.jpg", { type: "image/jpeg" })],
    },
  });

describe("HealingPhotoPage", () => {
  // CRA resets mock implementations before each test
  beforeEach(() => {
    imageCompression.mockImplementation(async (file) => file);
  });

  it("asks the client for a photo for their artist", async () => {
    getHealingPhotoSession.mockResolvedValue(session());
    renderPage();

    expect(
      await screen.findByText("How is it healing, Jane?")
    ).toBeInTheDocument();
    expect(getHealingPhotoSession).toHaveBeenCalledWith("tok123");
    expect(
      screen.getByText(/send brow studio a clear photo of your microblading/i)
    ).toBeInTheDocument();
  });

  it("sends the photo and thanks the client", async () => {
    getHealingPhotoSession.mockResolvedValue(session());
    uploadHealingPhoto.mockResolvedValue({
      url: "https://storage.example.com/p1.jpg",
      photosUploaded: 1,
    });
    renderPage();

    await screen.findByText("How is it healing, Jane?");
    choosePhoto();

    expect(await screen.findByText("Thank you, Jane!")).toBeInTheDocument();
    expect(uploadHealingPhoto).toHaveBeenCalledWith(
      "tok123",
      expect.any(File)
    );
    expect(
      screen.getByText("Your photo was sent to Brow Studio.")
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Send another photo" })
    ).toBeInTheDocument();
  });

  it("shows why a photo could not be sent", async () => {
    getHealingPhotoSession.mockResolvedValue(session());
    uploadHealingPhoto.mockRejectedValue({
      message: "Photos must be 5 MB or smaller.",
    });
    renderPage();

    await screen.findByText("How is it healing, Jane?");
    choosePhoto();

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Photos must be 5 MB or smaller."
    );
  });

  it("stops offering uploads at the limit", async () => {
    getHealingPhotoSession.mockResolvedValue(session({ photosUploaded: 5 }));
    renderPage();

    expect(
      await screen.findByText(/sent the maximum of 5 photos/i)
    ).toBeInTheDocument();
    expect(screen.queryByTestId("healing-photo-input")).toBeNull();
  });

  it("explains an expired link", async () => {
    getHealingPhotoSession.mockRejectedValue({
      status: 410,
      message: "This photo link has expired.",
    });
    renderPage();

    expect(
      await screen.findByText("This link has expired")
    ).toBeInTheDocument();
  });
});
