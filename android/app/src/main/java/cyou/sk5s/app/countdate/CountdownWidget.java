package cyou.sk5s.app.countdate;

import android.app.PendingIntent;
import android.appwidget.AppWidgetManager;
import android.appwidget.AppWidgetProvider;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.net.Uri;
import android.widget.RemoteViews;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Locale;

public class CountdownWidget extends AppWidgetProvider{
  @Override
  public void onUpdate(Context context, AppWidgetManager appWidgetManager, int[] appWidgetIds){
    // There may be multiple widgets active, so update all of them
    for (int appWidgetId : appWidgetIds) {
        SharedPreferences prefs = context.getSharedPreferences("CapacitorStorage",0);
        updateAppWidget(context, appWidgetManager, appWidgetId, prefs.getString("countdown_widget","No data"));
    }
  }

  private void updateAppWidget(Context context, AppWidgetManager appWidgetManager, int appWidgetId, String countdown_widget) {
    RemoteViews views = new RemoteViews(context.getPackageName(), R.layout.countdown_widget);
//    Intent intent = new Intent(Intent.ACTION_VIEW, Uri.parse("http://sk5s.cyou"));
//    PendingIntent pendingIntent = PendingIntent.getActivity(context, 0, intent, PendingIntent.FLAG_IMMUTABLE);
//    views.setOnClickPendingIntent(R.id.tvWidget, pendingIntent);
//    views.setTextViewText(R.id.tvWidget, getCurTimeStr());
    views.setTextViewText(R.id.tvWidget, countdown_widget);
    appWidgetManager.updateAppWidget(appWidgetId, views);
  }

  public static String getCurTimeStr() {
    return new SimpleDateFormat("dd-MM-yyyy", Locale.getDefault()).format(new Date());
  }
}
