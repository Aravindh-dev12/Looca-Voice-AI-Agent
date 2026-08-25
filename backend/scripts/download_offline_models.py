"""Pre-download local speech models so Looca can run without internet afterward."""

import argparse
import os


def download_fast(model_name: str) -> None:
    from faster_whisper import WhisperModel
    print(f"Downloading faster-whisper model: {model_name}")
    WhisperModel(
        model_name,
        device="cpu",
        compute_type="int8",
        download_root=os.getenv("OFFLINE_MODEL_DIR") or None,
    )
    print("Fast STT model ready.")


def download_mms(language: str) -> None:
    from transformers import AutoProcessor, Wav2Vec2ForCTC
    model_id = os.getenv("MMS_MODEL_ID", "facebook/mms-1b-all")
    print(f"Downloading MMS model and adapter: {model_id} / {language}")
    AutoProcessor.from_pretrained(model_id, target_lang=language)
    Wav2Vec2ForCTC.from_pretrained(
        model_id,
        target_lang=language,
        ignore_mismatched_sizes=True,
    )
    print("Extended MMS model ready.")


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--fast", action="store_true")
    parser.add_argument("--extended", action="store_true")
    parser.add_argument("--whisper-model", default=os.getenv("OFFLINE_WHISPER_MODEL", "base"))
    parser.add_argument("--mms-language", default="eng")
    args = parser.parse_args()
    if not args.fast and not args.extended:
        args.fast = True
    if args.fast:
        download_fast(args.whisper_model)
    if args.extended:
        download_mms(args.mms_language)


if __name__ == "__main__":
    main()
