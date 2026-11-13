import io
import base64
import urllib.parse
import qrcode
from PIL import Image

def generate_upi_qr_data_url(upi_id, payee_name, amount, transaction_note="CMPRO"):
    """
    Generates a trusted fixed-amount UPI payment QR code as a base64 Data URL.
    UPI URI Specification:
    upi://pay?pa=<UPI_ID>&pn=<NAME>&am=<AMOUNT>&cu=INR&tn=<NOTE>
    """
    encoded_name = urllib.parse.quote(payee_name)
    encoded_note = urllib.parse.quote(transaction_note)
    
    # Format amount with 2 decimal places
    amount_str = f"{float(amount):.2f}"

    upi_uri = f"upi://pay?pa={upi_id}&pn={encoded_name}&am={amount_str}&cu=INR&tn={encoded_note}"

    qr = qrcode.QRCode(
        version=1,
        error_correction=qrcode.constants.ERROR_CORRECT_M,
        box_size=10,
        border=2,
    )
    qr.add_data(upi_uri)
    qr.make(fit=True)

    img = qr.make_image(fill_color="#0F172A", back_color="#FFFFFF")
    
    buffer = io.BytesIO()
    img.save(buffer, format="PNG")
    b64_str = base64.b64encode(buffer.getvalue()).decode('utf-8')

    return {
        'upi_uri': upi_uri,
        'qr_data_url': f"data:image/png;base64,{b64_str}",
        'upi_id': upi_id,
        'payee_name': payee_name,
        'amount': amount_str,
        'currency': 'INR',
        'ref_note': transaction_note
    }
