package cyou.sk5s.app.countdate;

import static cyou.sk5s.app.countdate.CountdateWidgetConfig.KEY_DATA;
import static cyou.sk5s.app.countdate.CountdateWidgetConfig.KEY_DATE_PREFIX;
import static cyou.sk5s.app.countdate.CountdateWidgetConfig.KEY_ID_PREFIX;
import static cyou.sk5s.app.countdate.CountdateWidgetConfig.KEY_NAME_PREFIX;
import static cyou.sk5s.app.countdate.CountdateWidgetConfig.SHARED_PREFS;

import android.annotation.SuppressLint;
import android.app.PendingIntent;
import android.appwidget.AppWidgetManager;
import android.appwidget.AppWidgetProvider;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.widget.RemoteViews;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Locale;

public class CountdateWidget extends AppWidgetProvider {
    @Override
    public void onUpdate(Context context, AppWidgetManager appWidgetManager, int[] appWidgetIds){
        for (int appWidgetId : appWidgetIds){
            Intent intent = new Intent(context, MainActivity.class);
            PendingIntent pendingIntent = PendingIntent.getActivity(context, 0, intent, PendingIntent.FLAG_IMMUTABLE);

            Intent intent2 = new Intent(context, MainActivity.class);
            PendingIntent pendingIntent2 = PendingIntent.getActivity(context, 0, intent2, PendingIntent.FLAG_IMMUTABLE);

            SharedPreferences prefs = context.getSharedPreferences(SHARED_PREFS,Context.MODE_PRIVATE);
            //String eventId = prefs.getString(KEY_ID_PREFIX + appWidgetId,"0");
            String eventName = prefs.getString(KEY_NAME_PREFIX + appWidgetId,"No Data");
            String eventDate = prefs.getString(KEY_DATE_PREFIX + appWidgetId,"No Data");

            String numOfDays = "Retry";
            String countdownup = "⬇️Countdown";
            String[] parts = eventDate.split("T");
            try {
                Date today = new Date();
                Date anotherDate = new SimpleDateFormat("yyyy-MM-dd", Locale.getDefault()).parse(parts[0]);
                //numOfDays = String.valueOf(today.getTime()) + String.valueOf(anotherDate.getTime());
                if (anotherDate.getTime() > 0){
                    long difference = anotherDate.getTime() - today.getTime();
                    if (difference > 0){
                        numOfDays = String.valueOf((int) (difference / (1000 * 60 * 60 * 24)) + 1);
                    } else {
                        numOfDays = String.valueOf((int) (-difference / (1000 * 60 * 60 * 24)) - 1);
                        countdownup = "⬆️Countup";
                    }
                }
            } catch (ParseException e) {
                e.printStackTrace();
            }

            RemoteViews views = new RemoteViews(context.getPackageName(), R.layout.countdate_widget);
            views.setOnClickPendingIntent(R.id.countdate_widget_text1, pendingIntent);
            views.setOnClickPendingIntent(R.id.countdate_widget_text2, pendingIntent2);
//            Intent updateIntent = new Intent();
//            updateIntent.setAction(AppWidgetManager.ACTION_APPWIDGET_UPDATE);
//            PendingIntent updatePendingIntent = PendingIntent.getBroadcast(context, 0, updateIntent, PendingIntent.FLAG_UPDATE_CURRENT);
//            views.setOnClickPendingIntent(R.id.countdate_widget_text2, updatePendingIntent);

//            Intent intentUpdate = new Intent(context, CountdateWidget.class);
//            intentUpdate.setAction(AppWidgetManager.ACTION_APPWIDGET_UPDATE);
//            int[] idArray = new int[]{appWidgetId};
//            intentUpdate.putExtra(AppWidgetManager.EXTRA_APPWIDGET_IDS, idArray);
//            PendingIntent pendingUpdate = PendingIntent.getBroadcast(
//                    context, appWidgetId, intentUpdate,
//                    PendingIntent.FLAG_UPDATE_CURRENT);
//            views.setOnClickPendingIntent(R.id.countdate_widget_text2, pendingUpdate);

            views.setCharSequence(R.id.countdate_widget_text1,"setText", eventName+" "+countdownup);
            views.setCharSequence(R.id.countdate_widget_text2,"setText", numOfDays);

            appWidgetManager.updateAppWidget(appWidgetId, views);
        }
    }
}
